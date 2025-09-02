import Link from "next/link";

export default function exhibition() {
  return (
    <>
     
      <p className="text-center font-bold text-2xl mb-4">
  Exhibitions
</p>

<Link
  href="/exhibition/1"
  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-blue-50 transition text-center font-medium text-gray-700"
>
  Exhibition 1
</Link>

<Link
  href="/exhibition/2"
  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-blue-50 transition text-center font-medium text-gray-700"
>
  Exhibition 2
</Link>


<Link
  href="/exhibition/3"
  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-blue-50 transition text-center font-medium text-gray-700"
>
  Exhibition 3
</Link>


<Link
  href="/exhibition/4"
  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-blue-50 transition text-center font-medium text-gray-700"
>
  Exhibition 4
</Link>

<Link
  href="/exhibition/5"
  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-blue-50 transition text-center font-medium text-gray-700"
>
  Exhibition 5
</Link>

<Link
  href="/exhibition/6"
  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-blue-50 transition text-center font-medium text-gray-700"
>
  Exhibition 6
</Link>

<Link
  href="/exhibition/7"
  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg hover:bg-blue-50 transition text-center font-medium text-gray-700"
>
  Exhibition 7
</Link>



    </>
  );
}