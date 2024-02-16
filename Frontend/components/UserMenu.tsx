/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const UserMenu = (props) => {

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex justify-center bg-white outline-none focus:outline-none focus:border-none  ">
          <span className="relative w-10 h-10 ml-2 overflow-hidden ring-2 ring-gray-300 bg-gray-100 rounded-full dark:bg-gray-600">
                <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
            </span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-eksiCode">
          <div className="py-1">
          <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
                  @Mkltkn
                </a>
              )}
            </Menu.Item>
            <hr className="border-t border-gray-300" />
            <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
                  Dashboard
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
                {({ active }) => (
                  <a onClick={()=> props.setModalOpen(true)} className={classNames(active ? 'modal-open bg-gray-100 text-gray-900 cursor-pointer' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
                    Yeni Gönderi
                  </a>
                )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
                  Favoriler
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a href="#" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm')}>
                  Ayarlar
                </a>
              )}
            </Menu.Item>
            <form method="POST" action="#">
              <Menu.Item>
                {({ active }) => (
                  <button type="submit" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm')}>
                    Güvenli Çıkış
                  </button>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserMenu