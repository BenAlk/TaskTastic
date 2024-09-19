import { BarChart } from '@mui/x-charts/BarChart';
import PropTypes from "prop-types";

const BarChartKanBan = ({ project}) => {
  // Extract Kanban columns and count tasks
  const columnNames = project.kanban.columns.map(column => column.name);
  const columnColors = project.kanban.columns.map(column => column.color);
  const taskCounts = columnNames.map(columnName => 
    project.tasks.filter(task => task.kanbanColumn === columnName).length
  );
  // Find the maximum task count to set the y-axis max value
  const maxTaskCount = Math.max(...taskCounts);
  const yAxisMax = Math.max(maxTaskCount, 1);

  // Generate an array of whole numbers for y-axis ticks
  const yAxisTicks = Array.from({ length: yAxisMax + 1 }, (_, i) => i);

  const series = columnNames.map((name, index) => ({
    data: [taskCounts[index]],
    color: columnColors[index],
    label: name,
    valueFormatter: (value) => `${value} task${value !== 1 ? 's' : ''}`,
  }));

  return (
    <>
      <h2>{project.projectName} - Task Distribution</h2>
      <BarChart
        series={series}
        xAxis={[{ scaleType: 'band', data: [''] }]}
        yAxis={[{ min: 0, max: yAxisMax, tickInterval: yAxisTicks }]}
        slotProps={{
          loadingOverLay: {message: 'Select a project for data to display.'},
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
            labelStyle: { fontSize: 12 },
            itemMarkWidth: 5,
            itemMarkHeight: 5,
            itemGap: 15
          },
          
        }}
        tooltip={{ trigger: 'none' }}
    // tooltip={{ trigger: 'item', position: {vertical: 'bottom', horizontal: 'middle'}}}
      />
    </>
  );
};

export default BarChartKanBan

BarChartKanBan.propTypes = {
    project: PropTypes.object,
};