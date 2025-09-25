import React, { useState, useMemo } from 'react';
import Header from './Header';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { employeeData } from '../data/employeeData';
import { Users, Building2, DollarSign, TrendingUp} from 'lucide-react';
import { provideGlobalGridOptions } from 'ag-grid-community';

// Mark all grids as using legacy themes
provideGlobalGridOptions({ theme: "legacy" });

import { ModuleRegistry } from 'ag-grid-community'; 
import { ClientSideRowModelModule } from 'ag-grid-community';
import { NumberFilterModule } from 'ag-grid-community';
import { DateFilterModule } from 'ag-grid-community';
import { PaginationModule } from 'ag-grid-community';
import { CellStyleModule } from 'ag-grid-community';
import { ValidationModule } from 'ag-grid-community';
import { IntegratedChartsModule } from 'ag-grid-enterprise'; 
import { RowGroupingModule } from 'ag-grid-enterprise';
import { SetFilterModule } from 'ag-grid-enterprise';
import { ColumnsToolPanelModule } from 'ag-grid-enterprise';
import { FiltersToolPanelModule } from 'ag-grid-enterprise';
import { SideBarModule } from 'ag-grid-enterprise';
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise'; 

ModuleRegistry.registerModules([
  // Row model and core features
  ClientSideRowModelModule,
  PaginationModule,
  CellStyleModule,
  ValidationModule,
  NumberFilterModule,
  DateFilterModule,

  // Enterprise features used in this grid
  RowGroupingModule,
  SetFilterModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SideBarModule,

  // Integrated charts with enterprise charts engine
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
]); 

const EmployeeDashboard = () => {
  const [rowData] = useState(employeeData.employees);

  // Custom cell renderers
 const StatusRenderer = (params) => {
    const isActive = params.value;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const SalaryRenderer = (params) => {
    return (
      <span className="font-semibold text-green-600">
        ${params.value?.toLocaleString()}
      </span>
    );
  };

  const PerformanceRenderer = (params) => {
    const rating = params.value;
    const getColor = (rating) => {
      if (rating >= 4.5) return 'text-green-600';
      if (rating >= 4.0) return 'text-blue-600';
      if (rating >= 3.5) return 'text-yellow-600';
      return 'text-red-600';
    };

    return (
      <div className="flex items-center">
        <span className={`font-medium ${getColor(rating)}`}>
          {rating}
        </span>
        <div className="ml-2 flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-sm ${
                star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  const SkillsRenderer = (params) => {
    const skills = params.value || [];
    return (
      <div className="flex flex-wrap gap-2">
        {skills.slice(0, 2).map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-1 py-0.3 rounded text-xs font-medium bg-blue-100 text-blue-800"
          >
            {skill}
          </span>
        ))}
        {skills.length > 2 && (
          <span className="text-xs text-gray-500">+{skills.length - 2} more</span>
        )}
      </div>
    );
  };

  const columnDefs = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
      pinned: 'left',
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 120,
      pinned: 'left',
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 120,
      pinned: 'left',
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 130,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'position',
      headerName: 'Position',
      width: 180,
    },
    {
      field: 'salary',
      headerName: 'Salary',
      width: 120,
      cellRenderer: SalaryRenderer,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
    },
    {
      field: 'hireDate',
      headerName: 'Hire Date',
      width: 120,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : '',
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 80,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
    },
    {
      field: 'location',
      headerName: 'Location',
      width: 120,
      filter: 'agSetColumnFilter',
    },
    {
      field: 'performanceRating',
      headerName: 'Performance',
      width: 150,
      cellRenderer: PerformanceRenderer,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
    },
    {
      field: 'projectsCompleted',
      headerName: 'Projects',
      width: 100,
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      cellRenderer: StatusRenderer,
      filter: true,
      sortable: true,
    },
    {
      field: 'skills',
      headerName: 'Skills',
      width: 200,
      cellRenderer: SkillsRenderer,
      filter: false,
      valueFormatter: (params) =>
        Array.isArray(params.value) ? params.value.join(', ') : params.value ?? '',
    },
    {
      field: 'manager',
      headerName: 'Manager',
      width: 150,
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  }
   }, []);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const activeEmployees = rowData.filter(emp => emp.isActive);
    const totalSalary = activeEmployees.reduce((sum, emp) => sum + emp.salary, 0);
    const avgPerformance = activeEmployees.reduce((sum, emp) => sum + emp.performanceRating, 0) / activeEmployees.length;
    const departments = [...new Set(activeEmployees.map(emp => emp.department))];

    return {
      totalEmployees: activeEmployees.length,
      totalSalary,
      avgSalary: totalSalary / activeEmployees.length,
      avgPerformance: avgPerformance.toFixed(1),
      departments: departments.length,
    };
  }, [rowData]);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-semibold text-gray-900">{summaryStats.totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-semibold text-gray-900">{summaryStats.departments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Salary</p>
                <p className="text-2xl font-semibold text-gray-900">
                    ${Math.round(summaryStats.avgSalary).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Performance</p>
                <p className="text-2xl font-semibold text-gray-900">{summaryStats.avgPerformance}</p>
              </div>
            </div>
          </div>
        </div>

 
        {/* AG Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10,20]}
              animateRows={true}
            />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default EmployeeDashboard;