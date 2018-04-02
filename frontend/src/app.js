const app = new Vue({
  el: "#app",
  data: {
    orderId: "",
    pagers: []
  },
  mounted: function() {
    fetch("http://localhost:6969/api/v1/pagers")
      .then(res => {
        return res.json();
      })
      .then(json => {
        console.log(json);
        this.pagers = json.pagers;
      })
      .catch(e => {
        console.log(e);
      });
  },
  methods: {
    giveToCustomer: pager_id => {
      fetch({
        method: "POST",
        url: `http://localhost:8080/pager/issue-to-customer/${pager_id}`
      })
        .then(res => {
          return res.json();
        })
        .then(json => {
          console.log(json);
        });
    }
  }
});