import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ContextStore } from "../../store/ContextStore";

const ManageUsersSkeleton = () => {
  const taskArray = Array(9).fill("task");
  const { dark } = ContextStore();
  return (
    <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {taskArray.map((card, i) => (
        <div
          key={`${card}_${i}`}
          className="h-[150px] bg-[#f0f4f994] dark:shadow-gray-900 dark:bg-[#1f1f1f] dark:border-white/20 rounded-xl p-4 w-[330px]"
        >
          <div className="flex w-full  gap-3">
            <div className=" rounded-full size-15  ">
              <SkeletonTheme
                baseColor={dark ? "#202020" : ""}
                highlightColor={dark ? "#444" : ""}
              >
                <Skeleton circle className=" size-full" />
              </SkeletonTheme>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-[30px]  ">
                <SkeletonTheme
                  baseColor={dark ? "#202020" : ""}
                  highlightColor={dark ? "#444" : ""}
                >
                  <Skeleton className="h-full" />
                </SkeletonTheme>
              </div>
              <div className="h-[20px]  ">
                <SkeletonTheme
                  baseColor={dark ? "#202020" : ""}
                  highlightColor={dark ? "#444" : ""}
                >
                  <Skeleton className="h-full" />
                </SkeletonTheme>
              </div>
            </div>
          </div>
          <div className="h-[50px] mt-3">
            <SkeletonTheme
              baseColor={dark ? "#202020" : ""}
              highlightColor={dark ? "#444" : ""}
            >
              <Skeleton className="h-full" />
            </SkeletonTheme>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageUsersSkeleton;
