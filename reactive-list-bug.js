if (Meteor.isClient) {
  
  var list;

  /**
   * 
   * Creates a Checklist instance, with a local collection that maintains the status
   * of all checkboxes: 'checked', 'unchecked' or 'indeterminate'
   *
   */
  function createChecklist() {

    var _checked = new Meteor.Collection(null),

    check = function(id) {
      return _checked.upsert({_id: id}, {_id: id, status: 'checked'});
    },

    getStatus = function(id) {
      var item = _checked.findOne({_id: id})
      return item && item.status;
    },

    isChecked = function(id) {
      return _checked.find({_id: id, status: 'checked'}).count() > 0;
    },

    getCheckedIds = function() {
      return _checked.find({status: 'checked'}).map(function(doc){return doc._id});
    },

    toggle = function(id) {
      if ( isChecked(id) )
        return uncheck(id);
      else
        return check(id);
    },

    uncheck = function(id) {
      return _checked.upsert({_id: id}, {_id: id, status: 'unchecked'});
    };

    return Object.freeze({
      'check': check,
      'getCheckedIds': getCheckedIds,
      'getStatus': getStatus,
      'isChecked': isChecked,
      'toggle': toggle,
      'uncheck': uncheck
    });
  }

  Template.checklist.helpers({
    items: [
      {_id: 0, name: 'Item 1', value: 10},
      {_id: 1, name: 'Item 2', value: 20},
      {_id: 2, name: 'Item 3', value: 40},
      {_id: 3, name: 'Item 4', value: 20},
      {_id: 4, name: 'Item 5', value: 100},
      ],
    isChecked: function() {
      return list.isChecked(this._id);
    },
    status: function() {
      return list.getStatus(this._id);
    },
    checkedIds: function() {
      return EJSON.stringify(list.getCheckedIds());
    }
  });

  Template.checklist.events({
    'change [type=checkbox]': function(e, tmpl) {
      var id = e.target.dataset.id;
      list.toggle(id);
    }
  });

  Template.checklist.created = function() {
    list = createChecklist();
  }
}