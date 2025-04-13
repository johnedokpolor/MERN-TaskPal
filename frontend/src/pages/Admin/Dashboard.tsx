import { useEffect, useState } from "react";
import moment from "moment";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BASE_URL, ContextStore, TASK_URL } from "../../store/ContextStore";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import TaskListTable from "../../components/TaskListTable";
import { ChartData } from "../../utils/interfaces";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import DashboardSkeleton from "../../components/Skeletons/DashboardSkeleton";
import axios from "axios";

const COLORS = ["#FFC107", "#03A9F4", "#4CAF50"];

const Dashboard = () => {
  const { admin, getDashboardData, dashboardData } = ContextStore();
  const [pieChartData, setPieChartData] = useState<
    Array<{ status: string; count: number }>
  >([]);
  const [barChartData, setBarChartData] = useState<
    Array<{ priority: string; count: number }>
  >([]);
  [];
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${BASE_URL}/${TASK_URL}`);

      setAllTasks(response.data.tasks);
      await getDashboardData();
      setLoading(false);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (dashboardData?.charts) {
      prepareChartData(dashboardData.charts);
    }
  }, [dashboardData]);
  console.log(dashboardData);

  const firstname = admin?.name.split(" ")[0];
  const onSeeMore = () => {
    navigate("/admin/tasks");
  };
  // Prepare chart data
  const prepareChartData = (data: ChartData) => {
    const taskDistrubution = data?.taskDistrubution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistrubution?.Pending || 0 },
      { status: "In Progress", count: taskDistrubution?.InProgress || 0 },
      { status: "Completed", count: taskDistrubution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);
    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(PriorityLevelData);
  };
  console.log(pieChartData, barChartData);

  return (
    <div>
      <DashboardLayout activeMenu="Dashboard">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0 },
              }}
              className="card my-5"
            >
              <div className="col-span-3">
                <h2 className="text-xl md:text-2xl">
                  Good Morning {firstname}!
                </h2>
                <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                  {moment().format("dddd Do MMM YYYY")}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                <InfoCard
                  label="Total Tasks"
                  value={addThousandsSeparator(
                    dashboardData?.charts?.taskDistrubution?.All || 0
                  )}
                  color="bg-blue-500"
                />
                <InfoCard
                  label="Pending Tasks"
                  value={addThousandsSeparator(
                    dashboardData?.charts?.taskDistrubution?.Pending || 0
                  )}
                  color="bg-[#FFC107]"
                />
                <InfoCard
                  label="In Progress Tasks"
                  value={addThousandsSeparator(
                    dashboardData?.charts?.taskDistrubution?.InProgress || 0
                  )}
                  color="bg-[#03A9F4]"
                />
                <InfoCard
                  label="Completed Tasks"
                  value={addThousandsSeparator(
                    dashboardData?.charts?.taskDistrubution?.Completed || 0
                  )}
                  color="bg-[#4CAF50]"
                />
              </div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, delay: 0 },
                }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Task Distrubution</h5>
                </div>
                {allTasks.length > 0 ? (
                  <CustomPieChart data={pieChartData} colors={COLORS} />
                ) : (
                  <p>No Tasks Available</p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, delay: 0 },
                }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Priority Distrubution</h5>
                </div>

                {allTasks.length > 0 ? (
                  <CustomBarChart data={barChartData} />
                ) : (
                  <p>No Tasks Available</p>
                )}
              </motion.div>
              <div className="md:col-span-2">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg">Recent Tasks</h5>
                    <button className="card-btn" onClick={onSeeMore}>
                      See All <ArrowRight className="size-5" />
                    </button>
                  </div>
                  <TaskListTable tableData={dashboardData?.recentTasks} />
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
