import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ContextStore } from "../../store/ContextStore";

const DashboardSkeleton = () => {
  const cardsArray = Array(5).fill("card");
  const { dark } = ContextStore();
  console.log(cardsArray);
  return (
    <div>
      <div className="my-5">
        <SkeletonTheme
          baseColor={dark ? "#202020" : ""}
          highlightColor={dark ? "#444" : ""}
        >
          <Skeleton className="h-[140px] " />
        </SkeletonTheme>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 ">
        <div className="">
          <SkeletonTheme
            baseColor={dark ? "#202020" : ""}
            highlightColor={dark ? "#444" : ""}
          >
            <Skeleton className="h-[350px] " />
          </SkeletonTheme>
        </div>
        <div>
          <SkeletonTheme
            baseColor={dark ? "#202020" : ""}
            highlightColor={dark ? "#444" : ""}
          >
            <Skeleton className="h-[350px] " />
          </SkeletonTheme>
        </div>

        <div className="md:col-span-2">
          <div className="">
            <SkeletonTheme
              baseColor={dark ? "#202020" : ""}
              highlightColor={dark ? "#444" : ""}
            >
              <Skeleton className="h-[250px] " />
            </SkeletonTheme>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
