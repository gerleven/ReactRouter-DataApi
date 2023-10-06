import { Form, useFetcher, useLoaderData } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({params, request}){
  const contact = await getContact(params.contactId);
  if(!contact){
    throw new Response("", {
      status: 404,
      statusText: "Contact not Found"
    });
  }
  return { contact };
}

export async function action({params, request}){
  const formData = await request.formData();
  const newFavoriteValue = (formData.get("favorite") === "true")?true:false;
  const updatedEntry = {favorite: newFavoriteValue};
  return updateContact(params.contactId, updatedEntry);
}

export default function Contact() {
  const { contact } = useLoaderData();
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placekitten.com/g/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          
          <Form
            method="post"
            // <-- Si omitimos el action se usara el action default, que seria la ruta en la cual el Form fue renderizado, es decir /contacts
            // action={"/contacts/"+contact.id+"/destroy"} //<-- Podriamos porner el path completo, o usar 
            action={"destroy"} // <-- o usar el path relativo
            //action={"/destroy"} // <-- ojo con no poner "/destroy" esto redirige al home/destroy y esa ruta no existe
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  
  let favorite = contact.favorite;
  if(fetcher.formData){
    favorite = fetcher.formData.get("favorite")=="true";
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
        {/* {fetcher.state==="loading"? "⏱": (favorite ? "★" : "☆")} */}
      </button>
    </fetcher.Form>
  );
}