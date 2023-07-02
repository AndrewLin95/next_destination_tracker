import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderTitle = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      className="ml-8 pt-2"
      onClick={() => {
        router.push("/homepage");
      }}
    >
      <Image
        src="/DestinationLogoTransparent.png"
        alt="Destination"
        width={144}
        height={144}
        className="mix-blend-plus-lighter"
      />
    </button>
  );
};

export default HeaderTitle;
