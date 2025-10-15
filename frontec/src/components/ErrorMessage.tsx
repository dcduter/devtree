
export default function ErrorMessage({children} : {children: React.ReactNode}) {
    // children se asigna reactNode para que typescript infiera que children es un elemento react
  return (
    <p className="text-red-500 text-center bg-red-50 text-red-600 p-3 uppercase text-sm font-bold">{children}</p>
  )
}
