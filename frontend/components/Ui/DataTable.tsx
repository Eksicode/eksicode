import React from "react";

const DataTable = () => {
  return (
    <div className="basis-full overflow-x-auto w-full bg-white ">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Color
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Edit
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b  hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">$2999</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b   hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Microsoft Surface Pro
            </th>
            <td className="px-6 py-4">White</td>
            <td className="px-6 py-4">Laptop PC</td>
            <td className="px-6 py-4">$1999</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white  hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Magic Mouse 2
            </th>
            <td className="px-6 py-4">Black</td>
            <td className="px-6 py-4">Accessories</td>
            <td className="px-6 py-4">$99</td>
            <td className="px-6 py-4 text-right">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b  hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">$2999</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b   hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Microsoft Surface Pro
            </th>
            <td className="px-6 py-4">White</td>
            <td className="px-6 py-4">Laptop PC</td>
            <td className="px-6 py-4">$1999</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white  hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Magic Mouse 2
            </th>
            <td className="px-6 py-4">Black</td>
            <td className="px-6 py-4">Accessories</td>
            <td className="px-6 py-4">$99</td>
            <td className="px-6 py-4 text-right">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b  hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">$2999</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white border-b   hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Microsoft Surface Pro
            </th>
            <td className="px-6 py-4">White</td>
            <td className="px-6 py-4">Laptop PC</td>
            <td className="px-6 py-4">$1999</td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
          <tr className="bg-white  hover:bg-gray-50 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
            >
              Magic Mouse 2
            </th>
            <td className="px-6 py-4">Black</td>
            <td className="px-6 py-4">Accessories</td>
            <td className="px-6 py-4">$99</td>
            <td className="px-6 py-4 text-right">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </a>
            </td>
            <td className="px-6 py-4 text-right">
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Delete
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
