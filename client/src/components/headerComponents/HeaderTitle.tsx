import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderTitle = () => {
  const router = useRouter();
  return (
    <div className="pl-8">
      <button
        type="button"
        className="pt-2"
        onClick={() => {
          router.push("/homepage");
        }}
      >
        <Image
          src="/DestinationLogoTransparent.png"
          alt="Destination"
          width={144}
          height={144}
          className="dark:mix-blend-plus-lighter light:bg-black"
        />
      </button>
    </div>
  );
};

export default HeaderTitle;
