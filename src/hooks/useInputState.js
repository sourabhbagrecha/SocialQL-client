import { useState } from "react"

export default (initialVal="") => {
  const [state, setState] = useState(initialVal);
  const setInput = (e) => setState(e.target.value);
  const clearInput = () => setState("");
  return [state, setInput, clearInput];
}