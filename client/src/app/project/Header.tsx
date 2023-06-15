const Header = () => {
  return (
    <div className="w-screen h-16 flex flex-row justify-around items-center">
      <div>
        <div className="font-bold">Local Time of Latest Search: </div>
      </div>
      <button>Get Current Location</button>
      <div className="pl-8">
        <div className="font-bold">Current Location</div>
      </div>
    </div>
  );
};

export default Header;
