import Image from "next/image";

export default function LoginPage() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{
        background:
          "url('https://images.yourstory.com/cs/2/28b451402d6a11e9aa979329348d4c3e/Featue-1647082317203.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75')",
      }}
    >
      <div className="w-screen h-screen bg-black/50 items-center justify-center flex">
        <div className="flex flex-col bg-amber-50 items-center pt-12.5 pb-12.5 pl-5 pr-5 rounded-2xl shadow-amber-50">
          <Image
            src="/userlogo.png"
            alt="User logo"
            width="150"
            height="150"
            className="-mt-25"
          ></Image>
          <h1 className="text-5xl">Login</h1>
          <form className="flex flex-col mt-5">
            <input
              type="text"
              placeholder="Username"
              className="mb-4 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
            />
            <input
              type="password"
              placeholder="Password"
              className="mb-4 p-5 pt-2 pb-2 rounded-full focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(100,100,100,0.1)]"
            />
            <button
              type="submit"
              className="bg-amber-500 text-white p-2 mt-5 rounded-full hover:bg-amber-600 focus:outline-none shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]"
            >
              Login
            </button>
          </form>
          <p className="m-5">
            Don't have an account?
            <a
              href="register"
              className="text-blue-400 pl-2 pr-2 hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
