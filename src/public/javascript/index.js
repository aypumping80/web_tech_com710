//
const year = document.querySelector(".footer__year");

year.innerHTML = new Date().getFullYear();

window.addEventListener("DOMContentLoaded", (e) => {
  let delete_btn = document.querySelectorAll("button#delete");
  delete_btn &&
    delete_btn.forEach((item) => {
      item.addEventListener("click", (event) => {
        //handle click
        console.log("clicked");
        const id = event.target.name;
        fetch(`/api/animals/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            alert(data.message);
            window.location.href = "/animals";
          })
          .catch((err) => {
            alert(err);
          });
      });
    });
});
