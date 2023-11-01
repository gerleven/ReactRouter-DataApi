export function loader({params}){
  return null;
}
export function action({request, params}){
  return null;
}



export default function TimeOutPage() {
  return (<>
    <div id="timeout-page">
      <h2>Time out! ⏳🔐</h2>
      <h3>Still There?</h3>
      <i>Try navigating to an existing contact or create a new one to continue...</i>
    </div>
    </>);
}
