import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/layout/Layout"
import { Clock, Download, FileText, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const monthlyData = [
  { name: 'Jan', applications: 12 },
  { name: 'Feb', applications: 8 },
  { name: 'Mar', applications: 15 },
  { name: 'Apr', applications: 10 },
  { name: 'May', applications: 18 },
  { name: 'Jun', applications: 14 },
  { name: 'Jul', applications: 22 },
  { name: 'Aug', applications: 19 },
  { name: 'Sep', applications: 16 },
  { name: 'Oct', applications: 14 },
  { name: 'Nov', applications: 11 },
  { name: 'Dec', applications: 20 },
];

const statusData = [
  { name: 'Approved', value: 2, color: 'hsl(142, 71%, 45%)' },
  { name: 'Pending', value: 3, color: 'hsl(38, 92%, 50%)' },
  { name: 'Rejected', value: 1, color: 'hsl(0, 84%, 60%)' },
];

const leaveTypeData = [
  { name: 'Annual', value: 4, color: 'hsl(217, 91%, 60%)' },
  { name: 'Part', value: 0, color: 'hsl(38, 92%, 50%)' },
  { name: 'Paternity', value: 1, color: 'hsl(217, 91%, 70%)' },
  { name: 'Maternity', value: 0, color: 'hsl(292, 84%, 61%)' },
  { name: 'Sick', value: 0, color: 'hsl(0, 84%, 60%)' },
  { name: 'Compassionate', value: 1, color: 'hsl(173, 80%, 40%)' },
];

const departmentData = [
  { name: 'HR', value: 3 },
  { name: 'IT', value: 2 },
  { name: 'FIN', value: 5 },
  { name: 'OPS', value: 0 },
  { name: 'MKT', value: 0 },
];


const Reports = () => {
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleExport = () => {
    // Implement export functionality here
    console.log(`Exporting reports for year: ${selectedYear}`);
  };

  return (
    <Layout>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
                <p className="text-muted-foreground">Leave management insights and statistics</p>
              </div>
              <div className="flex gap-3">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Applications"
              value="6"
              icon={<FileText className="w-6 h-6" />}
              iconBgColor="bg-primary/10"
              gradientBarColor="bg-primary"
            />
            <StatCard
              title="Total Employees"
              value="7"
              icon={<Users className="w-6 h-6" />}
              iconBgColor="bg-success/10"
              gradientBarColor="bg-success"
            />
            <StatCard
              title="Avg. Days/Application"
              value="5.2"
              icon={<Clock className="w-6 h-6" />}
              iconBgColor="bg-warning/10"
              gradientBarColor="bg-warning"
            />
            <StatCard
              title="Approval Rate"
              value="78%"
              icon={<TrendingUp className="w-6 h-6" />}
              iconBgColor="bg-primary/10"
              gradientBarColor="bg-secondary-foreground"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Applications */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Applications</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#374bd1" 
                      strokeWidth={2}
                      dot={{ fill: '#374bd1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Application Status */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Application Status</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leave by Type */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Leave by Type</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaveTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                    <YAxis stroke="#888888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#374bd1', 
                        border: '1px solid #374bd1',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {leaveTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave by Department */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Leave by Department</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
                    <XAxis type="number" stroke="#888888" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#c9c9c9', 
                        border: '1px solid #000000',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="value" fill="#2f4bed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
    </Layout>
  )
}

export default Reports