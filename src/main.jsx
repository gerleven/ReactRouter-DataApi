//asd
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider, createRoutesFromElements, Route} from "react-router-dom"

import Root from "./routes/root.jsx"
import {loader as rootLoader, action as rootAction} from "./routes/root.jsx"

import Contact from "./routes/contact"
import {loader as contactLoader, action as contactAction} from "./routes/contact"

import EditContact from "./routes/edit";
import {loader as contactEditLoader, action as contactEditAction} from "./routes/edit"

import LogoutPage from "./routes/logout"
import {loader as logoutLoader, action as logoutAction} from "./routes/logout"

//import DestroyPage
import {action as destroyAction} from "./routes/destroy"

import Index from './routes'
import ErrorPage from "./error-page"

const myRouter = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    loader: rootLoader, //Recien cuando el user acceda a la ruta "/" se usara la funcion rootLoader para cargar de manera asincronica los contactos, los cuales se usan para geneerar los Links de manera dinamica con un map
    action: rootAction,
    errorElement: <ErrorPage/>,
    children: [
      {
        errorElement: <ErrorPage/>,
        children: [
          {
            index: true,
            element: <Index/>
          },
          {
            path: "contacts/:contactId",
            element: <Contact/>,
            loader: contactLoader,
            action: contactAction
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactEditLoader,
            action: contactEditAction
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction
          },
          {
            path: "logout/",
            element: <LogoutPage/>,
            loader: logoutLoader,
            action: logoutAction
          },
        ]
      }
    ],
  },
  
]);

const myRouterFromElements = buildRouterFromElements();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={myRouter}></RouterProvider>
  </React.StrictMode>,
)











function buildRouterFromElements(){
  //The same routes but created by <Route> elements:
  const routes = (
  <Route
      path="/"
      element={<Root />}
      loader={rootLoader}
      action={rootAction}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Index />} />
        <Route
          path="contacts/:contactId"
          element={<Contact />}
          loader={contactLoader}
          action={contactAction}
        />
        <Route
          path="contacts/:contactId/edit"
          element={<EditContact />}
          loader={contactLoader}
          action={contactEditAction}
        />
        <Route
          path="contacts/:contactId/destroy"
          action={destroyAction}
        />
        <Route
          path="logout/"
          element={<LogoutPage />}
          loader={logoutLoader}
          action={logoutAction}
        />
      </Route>
    </Route>
  );
  const routesFromElements = createRoutesFromElements(routes);
  const myRouterFromElements = createBrowserRouter(routesFromElements);
  return myRouterFromElements
}