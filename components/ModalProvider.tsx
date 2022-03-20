import { createContext, FC, useContext, useEffect, useState } from 'react'
import { ModalOptions, ShowModal } from '../lib/typings'

const initState: {
  showModal: ShowModal
} = {
  showModal: () => {},
}

const ModalContext = createContext(initState)

export const useModal = () => useContext(ModalContext)

const ModalProvider: FC = ({ children }) => {
  const [show, setShow] = useState(false)
  const [options, setOptions] = useState({} as ModalOptions)

  const showModal: ShowModal = (modalOptions) => {
    setShow(true)
    setOptions(modalOptions)
  }

  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'auto'
  }, [show])

  return (
    <ModalContext.Provider value={{ showModal }}>
      {show && (
        <div className="fixed inset-0">
          <div className="min-h-screen px-4 text-center">
            <div
              onClick={() => setShow(false)}
              className="fixed inset-0 bg-blue-dark/50"
            ></div>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="relative inline-block w-full max-w-sm space-y-3 rounded-lg bg-white p-5 px-6 text-left align-middle">
              <h4 className="text-lg font-bold text-blue-dark">
                {options.title}
              </h4>
              <p className="text-blue-dark-grayish">{options.description}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShow(false)
                    options.onCancel && options.onCancel()
                  }}
                  className="flex-grow rounded-lg bg-blue-dark-grayish py-3 font-medium uppercase text-gray-100 hover:bg-blue-dark-grayish/50"
                >
                  {options.cancelBtn || 'cancel'}
                </button>
                <button
                  onClick={() => {
                    setShow(false)
                    options.onConfirm && options.onConfirm()
                  }}
                  className="flex-grow rounded-lg bg-red-soft py-3 font-medium uppercase text-gray-100 transition-colors hover:bg-red-pale"
                >
                  {options.confirmBtn || 'yes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </ModalContext.Provider>
  )
}

export default ModalProvider
