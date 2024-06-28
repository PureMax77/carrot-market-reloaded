export default function Home() {
  return (
    <main className="bg-slate-100 h-screen flex items-center justify-center p-5">
      <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col md:flex-row gap-2">
        <input
          className="w-full rounded-full h-12 bg-gray-200 pl-5 outline-none ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow invalid:focus:ring-red-500 peer"
          type="email"
          required
          placeholder="Email address"
        />
        <span className="text-red-500 font-medium hidden peer-invalid:block">
          Email is required.
        </span>
        <button className=" bg-black text-white py-2 rounded-full active:scale-90 transition-transform font-medium outline-none md:px-10 ">
          Login
        </button>
      </div>
    </main>
  );
}
