import Cards from "./Cards";

const Coordinators = () => {
    return (
        <div className="flex flex-col items-center gap-y-6 py-12 bg-gradient-to-b from-white via-[#F4EFFA] to-[#E9E3F2]">
            <h1 className="text-2xl lg:text-5xl font-extrabold text-gray-900">Event Coordinators</h1>
            <Cards />
        </div>
    );
};

export default Coordinators;
