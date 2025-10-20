import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import { useColorScheme } from '../../components/useColorScheme';
import Colors from '../../constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     // Disable the static render of the header on web
    //     // to prevent a hydration error in React Navigation v6.
    //     headerShown: useClientOnlyValue(false, true),
    //     tabBarPosition: 'bottom'
    //   }}>
    //   <Tabs.Screen
    //     name="Overview"
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
    //       headerRight: () => (
    //         <Link href="/modal" asChild>
    //           <Pressable>
    //             {({ pressed }) => (
    //               <FontAwesome
    //                 name="info-circle"
    //                 size={25}
    //                 color={Colors[colorScheme ?? 'light'].text}
    //                 style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
    //               />
    //             )}
    //           </Pressable>
    //         </Link>
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="Explore"
    //     options={{
    //       title: 'Overview',
    //         tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
    //     }}
    //   />

    //   <Tabs.Screen
    //     name="Sharing"
    //     options={{
    //       title: 'Sharing',
    //         tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
    //     }}
    //   />
    // </Tabs>
    <Tabs
      screenOptions={{
        headerShown: false,   // 👈 Ẩn header cho tất cả tab
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarPosition: 'bottom',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false, // ẩn riêng header
          title: '',          // xoá chữ "index"
          tabBarLabel: 'Overview', // tên hiển thị ở bottom tab
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Overview"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="Sharing"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="share" color={color} />,
        }}
      />
    </Tabs>

  );
}
