module.exports = {
  eragilea: {
    eragilea: {
      belongsToMany: [{
        as: {
          singular: 'kolektiboa',
          plural: 'kolektiboak'
        },
        through: 'KolektiboaNorbanakoa'
      }]
    },
    proposamena: {
      belongsToMany: [{
        as: {
          singular: 'proposamena',
          plural: 'proposamenak'
        },
        through: 'proposamena_antolatzailea'
      }, {
        as: {
          singular: 'laguntza',
          plural: 'laguntzak'
        },
        through: 'proposamena_laguna'
      }]
    },
    asanblada: {
      belongsToMany: {
        as: {
          singular: 'asanblada',
          plural: 'asanbladak'
        },
        through: 'asanblada_partaidea'
      }
    },
    postazerrenda: {
      belongsToMany: {
        as: {
          singular: 'postazerrenda',
          plural: 'postazerrendak'
        },
        through: 'postazerrenda_kidea'
      }
    },
    lantaldea: {
      belongsToMany: {
        as: {
          singular: 'lantadea',
          plural: 'lantaldeak'
        },
        through: 'lantaldea_kidea'
      }
    },
    baliabidea: {
      belongsToMany: {
        as: {
          singular: 'baliabidea',
          plural: 'baliabideak'
        },
        through: 'baliabidea_arduraduna'
      }
    }
  },
  proposamena: {
    eragilea: {
      belongsToMany: [{
        as: {
          singular: 'antolatzailea',
          plural: 'antolatzaileak'
        },
        through: 'proposamena_antolatzailea'
      }, {
        as: {
          singular: 'laguna',
          plural: 'lagunak'
        },
        through: 'proposamena_laguna'
      }]
    },
    asanblada: {
        belongsTo: {}
    },
    proposamena: {
      belongsToMany: {
        as: {
          singular: 'ref',
          plural: 'refs'
        },
        through: 'ProposamenaRef'
      }
    },
    baliabidea: {
      belongsToMany: {
        as: {
          singular: 'baliabidea',
          plural: 'baliabideak'
        },
        through: 'proposamena_baliabidea'
      }
    },
    lantaldea: {
      belongsToMany: [{
        as: {
          singular: 'lantaldea',
          plural: 'lantaldeak'
        },
        through: 'proposamena_lantaldea'
      }]
    },
  },
  asanblada: {
    proposamena: {
      hasMany: {
        as: 'proposamenak'
      }
    },
    eragilea: {
      belongsToMany: {
        as: {
          singular: 'partaidea',
          plural: 'partaideak'
        },
        through: 'asanblada_partaidea'
      }
    },
    lantaldea: {
      belongsToMany: {
        as: {
          singular: 'lantaldea',
          plural: 'lantaldeak'
        },
        through: 'asanblada_lantaldea'
      }
    }
  },
  postazerrenda: {
    eragilea: {
      belongsToMany: {
        as: {
          singular: 'kidea',
          plural: 'kideak'
        },
        through: 'postazerrenda_kidea'
      }
    },
    lantaldea: {
      belongsTo: {
      }
    }
  },
  lantaldea: {
    postazerrenda: {
      hasOne: {
      }
    },
    eragilea: {
      belongsToMany: {
        as: {
          singular: 'kidea',
          plural: 'kideak'
        },
        through: 'lantaldea_kidea'
      }
    },
    asanblada: {
      belongsToMany: {
        as: {
          singular: 'lantaldea',
          plural: 'lantaldeak'
        },
        through: 'asanblada_lantaldea'
      }
    },
    proposamena: {
      belongsToMany: {
        as: {
          singular: 'proposamena',
          plural: 'proposamenak'
        },
        through: 'proposamena_lantaldea'
      }
    }
  },
  baliabidea: {
    eragilea: {
      belongsToMany: {
        as: {
          singular: 'arduraduna',
          plural: 'arduradunak'
        },
        through: 'baliabidea_arduraduna'
      }
    },
    proposamena: {
      belongsToMany: {
        as: {
          singular: 'proposamena',
          plural: 'proposamenak'
        },
        through: 'proposamena_baliabidea'
      }
    }
  }
};
