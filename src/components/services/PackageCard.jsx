import { Dot } from "lucide-react";
import apiClient from "../../../apiclient";
import { useNavigate } from "react-router-dom";


export const getPackages = () => {
  return apiClient.get(`/packages`).then(res => res.data);
};

export const getPackageBySlug = (slug) => {
  return apiClient
    .get(`/packages/${slug}`)
    .then(res => res.data.data); //extract actual package
};


const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/packages/${pkg.slug}`)}
      className="bg-white rounded-xl cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={pkg.image?.url}
        alt={pkg.name}
        className="h-60 w-full rounded-md object-contain bg-gray-200"
      />

      <h3 className="px-3 py-3 text-xl font-semibold">{pkg.name}</h3>

      {/*content div*/}
      <div className="flex justify-between px-4 py-2 text-justify">

        {/*Left side Content */}
        <div>
          <p className="text-sm text-gray-900 mb-2 font-medium">
            Included Services
          </p>

          <ul className="text-sm text-[#0b4c6a] space-y-1 list-disc list-inside ">
            {pkg.services.map((item) => (
              <li
                key={item._id}
                className="hover:text-[#0b4c6a]"
              >
                {item.service.name}
              </li>
            ))}
          </ul>
        </div>


          {/*Right Side Conten*/}
        <div className="text-right">
          <p className="bg-green-200 text-[14px] text-green-700 p-0.5 rounded-full text-center mb-1">
            Save ${pkg.regularPrice - pkg.packagePrice}
          </p>
          <p className="line-through text-sm text-gray-600">
            Regular: ${pkg.regularPrice}
          </p>
          <p className="text-lg font-semibold text-[#0b4c6a]">
            Package: ${pkg.packagePrice}
          </p>
          <p className="text-sm text-gray-600">
            Total Duration : <br />
          </p>
          <p className="text-sm text-gray-900 font-medium">
            {pkg.totalDuration} mins
          </p>
        </div>
      </div>

      {/* Button – stops card navigation */}
      <div className="flex justify-center my-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              "https://calendly.com/healcure/appointment",
              "_blank"
            );
          }}
          className="rounded-full w-[80%] bg-[#05507c] text-white py-1 hover:bg-[#093a52] hover:cursor-pointer transition"
        >
          Book Package
        </button>
      </div>
    </div>
  );
};


export default PackageCard
