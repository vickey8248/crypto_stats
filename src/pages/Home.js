import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import SearchIcon from "../assets/SearchIcon.svg";
import CloseIcon from "../assets/CloseIcon.svg";

function Home() {
  const initialState = {
    response: null,
    isLoading: false,
    isError: false,
  };
  const [ApiStatus, setApiStatus] = useState(initialState);
  const [SearchText, SetSearchText] = useState("");
  const [ApiResponse, setApiResponse] = useState([]);

  useEffect(() => {
    getCoin();
  }, []);

  const getCoin = async () => {
    SetSearchText("");
    setApiStatus({ ...initialState, isLoading: true });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_COIN_GECKO_API_URL}/coins/markets?vs_currency=inr&sparkline=true&x_cg_demo_api_key=${process.env.REACT_APP_COIN_GECKO_API_KEY}`
      );
      setApiResponse(response?.data);

      if (response.status == 200) {
        setApiStatus({
          isLoading: false,
          response: response?.data,
          isError: false,
        });
      } else {
        setApiStatus({
          isLoading: true,
          response: response?.data,
          isError: true,
        });
        setTimeout(getCoin, 4000);
      }
    } catch (error) {
      setApiStatus({
        isLoading: true,
        response: error?.response.data,
        isError: true,
      });
      setTimeout(getCoin, 4000);
    }
  };


  return (
    <>
      <div>
        <div className="flex justify-center w-full">
          <div className="bg-yellow-400 font-bold text-2xl w-[90%] p-4 rounded-lg mt-2 flex justify-between items-center">
            <div>Crypto Stats</div>
            <div className="mr-12 flex items-center gap-2 px-4 py-2 rounded text-base bg-white">
              <input
                type="text"
                className="outline-none font-normal"
                value={SearchText}
                onChange={(e) => SetSearchText(e.target.value)}
              ></input>
              <img
                src={SearchIcon}
                alt="searchicon"
                className="h-8 w-8 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      {ApiStatus?.isLoading && (
        <div className="h-full w-full grid place-items-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {ApiStatus?.isError == false && ApiStatus?.response && (
        <>
          {/* <div>{JSON.stringify(ApiStatus.response)}</div> */}
          <center>
            <table className="w-[90%] p-4 bg-white rounded-lg mb-2 mt-2 md:mb-8 text-center">
              <thead className="font-semibold text-base ">
                <tr>
                  <td className="p-5">Crypto</td>
                  <td>Symbol</td>
                  <td>Rank</td>
                  <td>Current Price</td>
                  <td>Market Cap</td>
                  <td>Volume</td>
                  <td>Graph</td>
                </tr>
              </thead>
              <tbody className="font-medium text-md">
                {ApiResponse.filter((value) => {
                  if (SearchText === "") {
                    return value;
                  } else if (
                    value.name.toLowerCase().includes(SearchText.toLowerCase())
                  ) {
                    return value;
                  }
                })?.map((ele, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-200" : "bg-transparent"
                    } px-2`}
                  >
                    <td className="flex items-center gap-4 px-4 py-6 text-left">
                      <img
                        src={ele?.image}
                        alt={ele?.name}
                        className="h-10 w-10 object-contain"
                      />
                      {ele?.name}
                    </td>
                    <td>{ele?.symbol}</td>
                    <td>{ele?.market_cap_rank}</td>
                    <td>
                      {ele?.current_price?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td>
                      {ele?.market_cap?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td>
                      {ele?.total_volume?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td className="w-[150px] pr-4 ">
                      <Sparklines data={ele?.sparkline_in_7d?.price}>
                        <SparklinesLine color="teal" />
                      </Sparklines>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </center>
        </>
      )}
    </>
  );
}

export default Home;
