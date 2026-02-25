import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './App.css';

interface SalesData {
  id: number;
  sale_date: string;
  customer_id: number;
  product: string;
  region: string;
  amount: number;
  quantity: number;
  status: string;
}

interface SummaryData {
  total_orders: number;
  total_customers: number;
  total_sales: number;
  avg_order_value: number;
  last_sale_date: string;
}

const API_BASE = 'http://localhost:3001/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

function App() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pivotData, setPivotData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    region: '',
    product: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  // 获取销售数据
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/sales`, { params: filters });
      setSalesData(response.data.data);
      processPivotData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    }
    setLoading(false);
  };

  // 获取汇总数据
  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE}/summary`);
      setSummary(response.data.data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  // 处理数据���视
  const processPivotData = (data: SalesData[]) => {
    const pivotMap = new Map<string, any>();

    data.forEach(item => {
      const key = `${item.region}-${item.product}`;
      if (!pivotMap.has(key)) {
        pivotMap.set(key, {
          region: item.region,
          product: item.product,
          totalAmount: 0,
          totalQuantity: 0,
          orderCount: 0
        });
      }
      const entry = pivotMap.get(key);
      entry.totalAmount += item.amount;
      entry.totalQuantity += item.quantity;
      entry.orderCount += 1;
    });

    setPivotData(Array.from(pivotMap.values()));
  };

  // 处理图表数据
  const processChartData = (data: SalesData[]) => {
    const chartMap = new Map<string, any>();

    data.forEach(item => {
      const date = item.sale_date;
      if (!chartMap.has(date)) {
        chartMap.set(date, { date, sales: 0, orders: 0 });
      }
      const entry = chartMap.get(date);
      entry.sales += item.amount;
      entry.orders += 1;
    });

    const sorted = Array.from(chartMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
    setChartData(sorted);
  };

  useEffect(() => {
    fetchSalesData();
    fetchSummary();
  }, []);

  useEffect(() => {
    if (salesData.length > 0) {
      processChartData(salesData);
    }
  }, [salesData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchSalesData();
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_BASE}/export`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales-export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📊 销售数据透视分析平台</h1>
        <p>实时销售数据分析和可视化</p>
      </header>

      {/* 汇总卡片 */}
      {summary && (
        <div className="summary-cards">
          <div className="card">
            <h3>总订单数</h3>
            <p className="value">{summary.total_orders}</p>
          </div>
          <div className="card">
            <h3>总客户数</h3>
            <p className="value">{summary.total_customers}</p>
          </div>
          <div className="card">
            <h3>总销售额</h3>
            <p className="value">¥{summary.total_sales?.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>平均订单值</h3>
            <p className="value">¥{summary.avg_order_value?.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* 筛选器 */}
      <div className="filters">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          placeholder="开始日期"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          placeholder="结束日期"
        />
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="">选择地区</option>
          <option value="华东">华东</option>
          <option value="华北">华北</option>
          <option value="华南">华南</option>
          <option value="华西">华西</option>
        </select>
        <select name="product" value={filters.product} onChange={handleFilterChange}>
          <option value="">选择产品</option>
          <option value="产品 A">产品 A</option>
          <option value="产品 B">产品 B</option>
          <option value="产品 C">产品 C</option>
          <option value="产品 D">产品 D</option>
          <option value="产品 E">产品 E</option>
        </select>
        <button onClick={handleSearch} disabled={loading}>
          {loading ? '加载中...' : '查询'}
        </button>
        <button onClick={handleExport} className="export-btn">
          📥 导出数据
        </button>
      </div>

      {/* 图表区域 */}
      <div className="charts-container">
        <div className="chart-box">
          <h2>销售趋势 (过去30天)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" name="销售额" />
              <Line type="monotone" dataKey="orders" stroke="#82ca9d" name="订单数" yAxisId="right" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>地区销售分布</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pivotData.reduce((acc: any[], item) => {
                  const existing = acc.find(x => x.region === item.region);
                  if (existing) {
                    existing.value += item.totalAmount;
                  } else {
                    acc.push({ region: item.region, value: item.totalAmount });
                  }
                  return acc;
                }, [])}
                dataKey="value"
                nameKey="region"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 数据透视表 */}
      <div className="pivot-table">
        <h2>销售数据透视表 (地区 × 产品)</h2>
        <table>
          <thead>
            <tr>
              <th>地区</th>
              <th>产品</th>
              <th>销售额</th>
              <th>数量</th>
              <th>订单数</th>
            </tr>
          </thead>
          <tbody>
            {pivotData.map((item, index) => (
              <tr key={index}>
                <td>{item.region}</td>
                <td>{item.product}</td>
                <td>¥{item.totalAmount.toFixed(2)}</td>
                <td>{item.totalQuantity}</td>
                <td>{item.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 原始数据表 */}
      <div className="data-table">
        <h2>原始销售数据 (前100条)</h2>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>客户ID</th>
              <th>产品</th>
              <th>地区</th>
              <th>销售额</th>
              <th>数量</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {salesData.slice(0, 100).map((item) => (
              <tr key={item.id}>
                <td>{item.sale_date}</td>
                <td>{item.customer_id}</td>
                <td>{item.product}</td>
                <td>{item.region}</td>
                <td>¥{item.amount.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;