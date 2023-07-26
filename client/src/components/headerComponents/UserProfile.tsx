import Image from "next/image";

const UserProfile = () => {
  return (
    <div>
      <Image
        src="/user-profile.png"
        alt="User Profile"
        width={144}
        height={144}
        className="h-8 w-auto pr-2"
      />
    </div>
  );
};

export default UserProfile;
