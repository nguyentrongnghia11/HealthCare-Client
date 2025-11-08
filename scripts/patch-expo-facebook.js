const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '..', 'node_modules', 'expo-facebook', 'android', 'build.gradle');

try {
  if (!fs.existsSync(filePath)) {
    console.log('[patch-expo-facebook] file not found, skipping:', filePath);
    process.exit(0);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace direct classifier usage for androidSourcesJar with Gradle-version compatible helper
  if (/classifier\s*=\s*'sources'/.test(content)) {
    // remove the direct classifier assignment line
    content = content.replace(/(task androidSourcesJar\([\s\S]*?\{)([\s\S]*?classifier\s*=\s*'sources'[\s\S]*?\})/, (match, p1, p2) => {
      // keep the task but without classifier line
      const taskBody = p2.replace(/\n?\s*classifier\s*=\s*'sources'\s*/g, '\n');
      return p1 + taskBody;
    });

    // insert helper after the task definition
    content = content.replace(/(task androidSourcesJar\([\s\S]*?\}\n)/, (m) => {
      const helper = "// Set classifier in a Gradle-version-compatible way (newer Gradle uses archiveClassifier)\n" +
                     "def setJarClassifier = { jarTask, value ->\n" +
                     "  try {\n" +
                     "    jarTask.archiveClassifier.set(value)\n" +
                     "  } catch (ignored) {\n" +
                     "    jarTask.classifier = value\n" +
                     "  }\n" +
                     "}\n\n" +
                     "setJarClassifier(androidSourcesJar, 'sources')\n\n";
      return m + helper;
    });
  }

  // Ensure compileSdkVersion is at least 36 by replacing safeExtGet usage if present
  if (/compileSdkVersion\s+safeExtGet\(\"compileSdkVersion\"/.test(content)) {
    content = content.replace(/compileSdkVersion\s+safeExtGet\(\"compileSdkVersion\",\s*\d+\)/, 'compileSdkVersion 36');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('[patch-expo-facebook] patched', filePath);
  } else {
    console.log('[patch-expo-facebook] no changes needed');
  }
} catch (err) {
  console.error('[patch-expo-facebook] error patching file:', err);
  process.exit(1);
}
