module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Institutions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      funding: {
        type: Sequelize.STRING,
      },
      townId: {
        type: Sequelize.STRING,
        references: {
          model: 'Towns',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      provinceId: {
        type: Sequelize.STRING,
        references: {
          model: 'Provinces',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async queryInterface => queryInterface.dropTable('Institutions'),
};
