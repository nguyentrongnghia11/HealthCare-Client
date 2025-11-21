import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getNutritionStats, getRunningStats, StatsResponse } from '../../api/overview';
import { Colors, useTheme } from '../../contexts/ThemeContext';

interface StatsChartModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'steps' | 'calories' | 'water' | 'sleep';
  title: string;
}

export default function StatsChartModal({ visible, onClose, type, title }: StatsChartModalProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadStatsData();
    }
  }, [visible, type]);

  const loadStatsData = async () => {
    try {
      setIsLoading(true);
      
      // Get date range for current week
      const now = new Date();
      const endDate = now.toISOString().split('T')[0];
      const startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];

      let data: StatsResponse;
      
      if (type === 'steps') {
        data = await getRunningStats(startDate, endDate);
      } else if (type === 'calories') {
        data = await getNutritionStats(startDate, endDate);
      } else {
        // For water and sleep, we'll use mock data for now
        data = {
          stats: [],
          chartData: { labels: [], datasets: {} },
          summary: {},
        };
      }
      
      setStatsData(data);
    } catch (error) {
      console.error('Error loading stats data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconAndUnit = () => {
    switch (type) {
      case 'steps':
        return { icon: '👟', unit: 'steps' };
      case 'calories':
        return { icon: '🔥', unit: 'kcal' };
      case 'water':
        return { icon: '💧', unit: 'ml' };
      case 'sleep':
        return { icon: '😴', unit: 'hours' };
      default:
        return { icon: '📊', unit: '' };
    }
  };

  const { icon, unit } = getIconAndUnit();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalIcon}>{icon}</Text>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00D2E6" />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Loading chart data...
                </Text>
              </View>
            ) : (
              <>
                {/* Summary */}
                {statsData?.summary && Object.keys(statsData.summary).length > 0 && (
                  <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.summaryTitle, { color: colors.textSecondary }]}>
                      Weekly Summary
                    </Text>
                    {Object.entries(statsData.summary).map(([key, value]) => (
                      <View key={key} style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.text }]}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>
                          {typeof value === 'number' ? value.toLocaleString() : value} {unit}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Chart Data */}
                {statsData?.chartData?.labels && statsData.chartData.labels.length > 0 && (
                  <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.chartTitle, { color: colors.text }]}>Daily Breakdown</Text>
                    {statsData.chartData.labels.map((label, index) => {
                      const datasets = statsData.chartData.datasets;
                      const firstDatasetKey = Object.keys(datasets)[0];
                      const value = datasets[firstDatasetKey]?.[index] || 0;
                      
                      return (
                        <View key={label} style={styles.chartRow}>
                          <Text style={[styles.chartDate, { color: colors.textSecondary }]}>
                            {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Text>
                          <View style={styles.chartBarContainer}>
                            <View 
                              style={[
                                styles.chartBar, 
                                { 
                                  width: `${Math.min((value / Math.max(...datasets[firstDatasetKey])) * 100, 100)}%`,
                                  backgroundColor: isDark ? '#00D2E6' : '#27b315'
                                }
                              ]} 
                            />
                          </View>
                          <Text style={[styles.chartValue, { color: colors.text }]}>
                            {value.toLocaleString()}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* No Data Message */}
                {(!statsData || !statsData.chartData?.labels || statsData.chartData.labels.length === 0) && (
                  <View style={styles.noDataContainer}>
                    <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
                      No data available for this week
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIcon: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  chartCard: {
    padding: 16,
    borderRadius: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  chartDate: {
    fontSize: 12,
    fontWeight: '500',
    width: 60,
  },
  chartBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: 12,
  },
  chartValue: {
    fontSize: 14,
    fontWeight: '600',
    width: 60,
    textAlign: 'right',
  },
  noDataContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
  },
});
