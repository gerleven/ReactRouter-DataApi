import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({params}){
  const contact = await getContact(params.contactId);
  return { contact };
}
export async function action({request, params}){
  const formData = await request.formData();
  const updates = Object.fromEntries(formData); //El Object.fromEntries retorna el objeto {first, last, twietter, avatar, notes}
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`) //El redirect retorna un objeto Response.
}

export default function EditContact() {
  const { contact }  = useLoaderData();
  const navigate = useNavigate();
  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={()=>{navigate(-1);}}>Cancel</button>
        {/* El -1 es equivalente a hacer click en la fechita back del navegador, por lo tanto no quita el ultimo segmento de la url si no que vuelve a la url anteior */}
        {/* Si estas en el home y pegas la url de http://127.0.0.1:5173/contacts/d22ov5g/edit y despues apretas Cancel */}
      </p>
    </Form>
  );
}