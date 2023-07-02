import Image from "next/image";

const GithubLink = () => {
  return (
    <div>
      <a
        href="https://github.com/AndrewLin95/next_destination_tracker"
        target="_blank"
      >
        <Image
          src="/github-mark-white.png"
          alt="GitHub"
          width={144}
          height={144}
          className="h-8 w-auto"
        />
      </a>
    </div>
  );
};

export default GithubLink;
