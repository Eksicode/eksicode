import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

const NewPost = ( {modalClose}: any ) => {
  let [modalOpen, setModalOpen] = useState(true)

  return (
    <>
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => { modalClose(false) }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed bg-gray-500 inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-screen transform overflow-hidden bg-white p-6 text-left align-middle transition-all">
                <div className="text-right">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-eksiCode px-4 py-2 text-sm font-medium text-white hover:bg-eksiCodeDark focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={() => { modalClose(false) }}
                    >
                      Kapat X
                    </button>
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg text-center font-medium leading-6 text-gray-900"
                  >
                    Yeni Gönderi Oluştur
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Post form
                    </p>
                  </div>

                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default NewPost