const app = new Vue({
  el: "#app",
  data: {
    orderId: "",
    pagers: []
  },
  mounted: function() {
    const socket = io("http://127.0.0.1:8000/");
    socket.on("newPager", pager => {
      const didConfirm = confirm(
        `Do you want to add user on port ${pager.portNumber} with id: ${
          pager.pagerId
        }`
      );

      if (didConfirm) {
        this.pagers.push({
          pager_id: pager.pagerId,
          pager_port: pager.portNumber,
          pager_connected: 1,
          pager_status: 0
        });
        socket.emit("newPagerResponse", true);
      } else {
        socket.emit("newPagerResponse", false);
      }
    });

    fetch("http://localhost:8080/api/v1/pagers")
      .then(res => {
        return res.json();
      })
      .then(json => {
        this.pagers = json;
      })
      .catch(e => {
        console.log(e);
      });
  },
  methods: {
    doAction(pagerId, pagerStatus, index) {
      switch (pagerStatus) {
        case 0:
          console.log(this.orderId);
          // Activate  the pager
          fetch(
            `http://localhost:8080/api/v1/pagers/${pagerId}/activate/${
              this.orderId
            }`,
            {
              method: "POST"
            }
          ).then(res => {
            if (res.status === 403) {
              swal("That orderId already exists!");
              return;
            }

            this.pagers[index].pager_status += 1;
          });
          break;
        case 1:
          // Send ringing notification
          fetch(`http://localhost:8080/api/v1/pagers/${pagerId}/ring`, {
            method: "POST"
          }).then(() => {
            this.pagers[index].pager_status += 1;
          });
          break;
        case 2:
          // Deactivate pager
          fetch(`http://localhost:8080/api/v1/pagers/${pagerId}/deactivate`, {
            method: "POST"
          }).then(() => {
            this.pagers[index].pager_status = 0;
          });
          break;
      }
    }
  }
});
