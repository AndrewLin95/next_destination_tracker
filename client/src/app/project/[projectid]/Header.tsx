import GithubLink from "@/components/headerComponents/GithubLink";
import HeaderTitle from "@/components/headerComponents/HeaderTitle";
import UserProfile from "@/components/headerComponents/UserProfile";

const Header = () => {
  return (
    <div className="w-screen h-16 flex flex-row justify-between items-center">
      <HeaderTitle />
      <div className="pl-8 flex flex-row pr-8">
        <UserProfile />
        <GithubLink />
      </div>
    </div>
  );
};

export default Header;
