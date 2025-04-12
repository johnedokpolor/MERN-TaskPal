import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ContextStore } from "../../store/ContextStore";

const ViewTaskDetailsSkeleton = () => {
  const { dark } = ContextStore();
  return (
    <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className=" bg-[#f0f4f994] dark:shadow-gray-900 dark:bg-[#1f1f1f] dark:border-white/20 rounded-xl p-4 col-span-4">
        <div className="h-[45px]">
          <SkeletonTheme
            baseColor={dark ? "#202020" : ""}
            highlightColor={dark ? "#444" : ""}
          >
            <Skeleton className="h-full" />
          </SkeletonTheme>
        </div>
        <div className="h-[140px] mt-4">
          <SkeletonTheme
            baseColor={dark ? "#202020" : ""}
            highlightColor={dark ? "#444" : ""}
          >
            <Skeleton className="h-full" />
          </SkeletonTheme>
        </div>
        <div className="h-[140px] mt-4">
          <SkeletonTheme
            baseColor={dark ? "#202020" : ""}
            highlightColor={dark ? "#444" : ""}
          >
            <Skeleton className="h-full" />
          </SkeletonTheme>
        </div>
        <div className="h-[140px] mt-4">
          <SkeletonTheme
            baseColor={dark ? "#202020" : ""}
            highlightColor={dark ? "#444" : ""}
          >
            <Skeleton className="h-full" />
          </SkeletonTheme>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskDetailsSkeleton;
