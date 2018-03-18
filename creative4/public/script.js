var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: '',
  },
  created: function() {
    this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	return this.items.filter(function(item) {
	  return !item.completed;
	});
      if (this.show === 'completed')
	return this.items.filter(function(item) {
	  return item.completed;
	});
      return this.items;
    },

    totalIncome() {
     return this.records.filter(record => {
       return record.amount > 0;
     }).reduce((sum, income) => {
       return sum + income.amount;
     }, 0);
   },

   totalOutcome() {
     return this.records.filter(record => {
       return record.amount < 0;
     }).reduce((sum, outcome) => {
       return sum + outcome.amount;
     }, 0);
   },

   totalAmount() {
     return this.records.reduce((sum, record) => {
       return sum + record.amount;
     }, 0);
   },
  },
  methods: {
    addItem: function() {
      axios.post("/api/items", {
	text: this.text + "- $",
	priority: this.priority,
	completed: false
      }).then(response => {
	this.text = "";
	this.getItems();
	return true;
      }).catch(err => {
      });
    },
      getItems: function() {
      axios.get("/api/items").then(response => {
	this.items = response.data;
	return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
      axios.put("/api/items/" + item.id, {
	text: item.text,
	completed: !item.completed,
	priority: item.priority,
	orderChange: false,
      }).then(response => {
	return true;
      }).catch(err => {
      });
    },
     deleteItem: function(item) {
      axios.delete("/api/items/" + item.id).then(response => {
	this.getItems();
	return true;
      }).catch(err => {
      });
    },
    showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    showCompleted: function() {
      this.show = 'completed';
    },
    sortItem: function() {
      this.show = 'sort';
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("/api/items/" + this.drag.id, {
	text: this.drag.text,
	completed: this.drag.completed,
	priority: this.drag.priority,
	orderChange: true,
	orderTarget: item.id
      }).then(response => {
	this.getItems();
	return true;
      }).catch(err => {
      });
    },
  },
});
