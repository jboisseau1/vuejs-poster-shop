var PRICE = 9.99;
var LOAD_MIN = 10;
new Vue({
  el: "#app",
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: "simpsons",
    lastSearch: "",
    loading: false,
    price: PRICE
  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_MIN);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if(this.newSearch.length){
      this.items = [];
      this.loading = true;
      this.$http.get("/search/".concat(this.newSearch)).then(function(res) {
        this.results = res.data;
        this.appendItems();
        this.lastSearch = this.newSearch;
        this.loading = false;
      });
    }
    },
    addItem: function(index) {
      var item = this.items[index];
      var found = false;

      this.total += PRICE;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++;
          found = true;
          break;
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },
    inc: function(item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {
      return "$".concat(price.toFixed(2));
    }
  },
  computed:{
    noMoreItems: function(){
      return this.items.length === this.results.length && this.results.length > 0;
    }
  },
  mounted: function() {
    this.onSubmit();
    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  }
});
