import HeaderTitle from "@/components/headerComponents/HeaderTitle";

const Header = () => {
  return (
    <div className="w-screen h-16 flex flex-row justify-between items-center">
      <HeaderTitle />
      <button>Get Current Location</button>
      <div className="pl-8">
        <div className="font-bold">Current Location</div>
      </div>
    </div>
  );
};

export default Header;
