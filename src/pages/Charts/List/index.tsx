import { listMyChartByPageUsingPOST } from '@/services/jubi/chartController';
import { useModel } from '@@/exports';
import { Avatar, Card, List, message, Result } from 'antd';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
/**
 * 展示我的图表
 * @returns
 */
const ListMyChart: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  enum ChartExecStatus {
    WAIT = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILED = 3,
  }

  /**
   * 加载图表数据，并作处理
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的title
        if (res.data.records) {
          res.data.records.forEach((chart: API.Chart) => {
            const chartOption = JSON.parse(chart.genChart ?? '{}');
            chartOption.title = undefined;
            chart.genChart = JSON.stringify(chartOption);
          });
        }
      } else {
        message.error('获取我的图表信息失败');
      }
    } catch (error: any) {
      message.error('获取我的图表信息失败，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="list-chart">
      <div className="margin-16">
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value: string) => {
            // 设置搜索条件
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page: number, pageSize: number) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        // itemLayout="horizontal"
        loading={loading}
        dataSource={chartList}
        renderItem={(item: API.Chart) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型' + item.chartType : undefined}
              />
              <>
                {item.execStatus === ChartExecStatus.WAIT && (
                  <>
                    <Result
                      status="warning"
                      title="待生成"
                      subTitle={item.execMsg ?? '当前图表生成队列繁忙，请耐心等待'}
                    />
                  </>
                )}
                {item.execStatus === ChartExecStatus.RUNNING && (
                  <>
                    <Result
                      status="info"
                      title="生成中"
                      subTitle={item.execMsg ?? '当前图表生成中，请耐心等待'}
                    />
                  </>
                )}
                {item.execStatus === ChartExecStatus.SUCCESS && (
                  <>
                    <div className="margin-16" />
                    <p>{'分析目标' + item.goal}</p>
                    <div className="margin-16" />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                    <div className="margin-16" />
                    <p>{'分析结果' + item.genResult}</p>
                  </>
                )}
                {item.execStatus === ChartExecStatus.FAILED && (
                  <>
                    <Result status="error" title="生成失败" subTitle={item.execMsg} />
                  </>
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default ListMyChart;
