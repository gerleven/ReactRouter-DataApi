import {Outlet,Link,NavLink,useLoaderData,useActionData,Form,redirect,useNavigation,useSubmit} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useState, useEffect } from "react";
import {useSessionTime} from "../hooks/admin";

//Esta funcion sera invocada cuando el usuario acceda a la ruta "/" para cargar de manera asincronica los contactos que luego usamos para generar los Links de manera dinamica
export async function loader({ request }) {
    const url = new URL(request.url); //Esta request es enviado por el <Form> del search
  const q = url.searchParams.get("q") || ""; //q is the URLsearchParams
  const contacts = await getContacts(q);
  return { contacts, q };
}

//Gracias a este action y al <Form method="post"> podemos hacer el post para crear un nuevo contacto sin tener que usar useState, ni useEffect ni fetch(url, post) ni nada.
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation(); //navigation has this props: [state, location, formData, json, text, formAction, formMethod]
  const submit = useSubmit();

  //Tradicionalmente la forma de mantener sincronizado el value del search seria con un useEffect(()=>{},[q]), una variable de estado [q,setQ] y un value={q} y onChange={setQ} en el input. Pero de esta forma no ahorramos todo eso y es mucho mas simple
  useEffect(() => {
    document.getElementById("searchNameInput").value = q;
  }, [q]);

  //Boolean value abour if the current location is searching or not:
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q"); //This boolean value indicate if the app is searching something

  const remainingTime = useSessionTime();

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(event.target, {method: "get", action:"/logout"});
  };

  function test(){
    console.log("state: "+navigation.state);
  }

  //Test:
  // useEffect(()=>{
    //   if(navigation.location){
      //     console.log("State: "+navigation.state);
      //     console.log("Path Name: "+navigation.location.pathname);
      //     console.log("search query: "+navigation.location.search);
      //     console.log("Navigation: ");
      //     console.table(navigation.location);
    //   }
  // }, [navigation]);
  // useEffect(()=>{
    //   if(navigation.location){
      //     console.log("State: "+navigation.state);
    //   }
  // }, [navigation.state]);
  
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>

        {/* Form Search */}
        <div>
          {/* Este Form no tiene method entonces por defecto la request que manda es un get (la recibe el loader) y como no tiene action=<path> lo manda a esta misma ruta donde fue renderizado*/}
          <Form
            id="search-form"
            role="search"
            // onChange={(event) => {submit(event.currentTarget)}} //El <Form> tambien tiene un onChange, con un submit dentro del onChange se haria un submit por cada cambio, y por lo tanto, la lista filtrada en tiempo real
            //El event.currentTarget tiene formData de este Form en el cual tenemos el #id del input searchNameINput y su value ingresado por el usuario: {id: searchNameInput, value: "Ger"}
            //De todas maneras el onChange conviene ponerlo en el input y no aca, porque si en el futuro hay mas elementos en el form no sabemos si queremos hacer submit para todos, por ahora queremos hacerlo solo si cambia el input del search
          >
            <input
              id="searchNameInput"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => { //con un submit dentro del onChange del input se haria un submit por cada cambio, y por lo tanto, la lista filtrada en tiempo real
                const isFirstSearch = (q==null);
                submit(event.currentTarget.form, {replace: !isFirstSearch }) //El event.currentTarget tiene el #id de este input y el  currentTarget.form el di del form padre de este input
              }}
              className={searching?"loading":""}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        
        {/* Nav */}
        <nav>

          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {({ isActive, isPending }) => (
                      <>
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}
                        <span>{isPending ? "⏳" : (contact.favorite && "★")}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
        <p>Session Time remaining: {remainingTime}</p>
      </div>

      {/* Details */}
      {false&&<div id="detail" className={navigation.state==="loading"?"loading":""}>
        <h1>test</h1>
        {navigation.location && <p>Yendo a: {navigation.location.pathname} con la query: {navigation.location.search}</p>}
        <p>Location: {navigation.location?"yes":"No"}</p>
        {/* <p>State: {navigation.state}</p> */}
        <button onClick={test}>Test</button>
        {/* <p>Time remaining 1: {remainingTime}</p>
        <Form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" />
        <button type="submit">Submit</button>
      </Form> */}
      </div>}

      <div id="detail" className={navigation.state==="loading"?"loading":""}>
            <Outlet/>
        </div>
    </>
  );
}
