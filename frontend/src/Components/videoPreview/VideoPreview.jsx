import { Link, useSearchParams } from "react-router-dom";
import { videos } from "../../pages/home/Home";
import Comments from "./videoComments/Comments";
import VideoInfos from "./videoInfos/VideoInfos";
import VideoPlayer from "./videoPlayer/VideoPlayer";
import { ReactComponent as Verified } from "../../assets/verified.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchVideoStart,
  fetchVideoSuccess,
} from "../../store/videosServices/videosServices.action";
import { getVideo } from "../../services/videoService";
import { countFormatter } from "../../utils/countFormatter";
import LoadingSpinner from "../loadingSpinner/spinner";

import "./videoPreview.css";

const VideoPreview = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Global videos state
  const videosData = useSelector((state) => state.videosServices);
  // Global user state
  const appUser = useSelector((state) => state.appUser);

  const dispatch = useDispatch();
  const idParam = searchParams.get("id");

  useEffect(() => {
    dispatch(fetchVideoStart());
    const getVideoData = async () => {
      const fetchData = async () => {
        return await getVideo(searchParams.get("id"));
      };
      try {
        const video = await fetchData();
        // console.log(video.data);
        if (video.data) {
          // console.log(video.data);
          dispatch(fetchVideoSuccess(video.data));
          // console.log(videosData);
        }
      } catch (err) {
        console.log("💥💥💥💥" + err);
      }
    };

    getVideoData();
  }, [idParam]);

  console.log(appUser?.currentUser);

  return (
    <>
      <div className="grid grid-cols-1 grid-rows-3 ml-[5%] mt-10 sm:grid-cols-3 sm:grid-rows-2">
        {!videosData.isFetching && (
          <>
            <div className="col-span-2 ">
              <div className="video-container">
                <VideoPlayer video={videosData.video} />
              </div>
              <div className="video-infos-container">
                <VideoInfos video={videosData.video} />
              </div>
            </div>
            <div className="recommendations-container flex flex-col gap-5 row-span-2 ml-[10%]">
              <div className="text-lg font-bold tracking-wider self-start">
                Recommendations
              </div>
              <div className="flex flex-col gap-6">
                {videosData.videos.map((video) => (
                  <Link
                    to={`/videos?id=${video.id}`}
                    key={video.id}
                    className=""
                  >
                    <div className="relative">
                      <img
                        src={`${video.thumbnailUrl}`}
                        alt="video thumbnail"
                        className="rounded-[4px] h-[9rem] w-[18rem] "
                        loading="lazy"
                      />
                      <div className="overlay"></div>
                    </div>
                    <div className="video-infos">
                      <ul className="flex flex-col">
                        <li className="text-md font-medium">{video.title}</li>
                        <li className="flex gap-2 items-center text-sm text-pink-800 font-medium">
                          {"video.channel"}
                          <Verified className="fill-black	" />
                        </li>
                        <li className="text-sm">
                          {countFormatter(video.viewsCount)} views
                        </li>
                      </ul>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="comments-container col-span-2 ">
              <Comments currentUserId="1" />
            </div>
          </>
        )}
      </div>
      {videosData.isFetching && <LoadingSpinner className="self-start" />}
    </>
  );
};

export default VideoPreview;
