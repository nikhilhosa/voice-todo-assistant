export function parseDate(text:string){

  const now = new Date();

  if(text.includes("tomorrow")){
    const date = new Date();
    date.setDate(now.getDate()+1);
    return date;
  }

  if(text.includes("today")){
    return now;
  }

  return null;
}
