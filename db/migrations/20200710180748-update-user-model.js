module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Users', 'institutionId', {
        type: Sequelize.STRING,
        references: {
          model: 'Institutions',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }, { transaction });

      await queryInterface.addColumn('Users', 'provinceId', {
        type: Sequelize.STRING,
        references: {
          model: 'Provinces',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }, { transaction });

      await queryInterface.addColumn('Users', 'townId', {
        type: Sequelize.STRING,
        references: {
          model: 'Towns',
          key: 'id',
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }, { transaction });

      await queryInterface.addColumn('Users', 'admin', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }, { transaction });

      await queryInterface.removeColumn('Users', 'entity', { transaction });
      await queryInterface.removeColumn('Users', 'place', { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Users', 'institutionId', { transaction });
      await queryInterface.removeColumn('Users', 'provinceId', { transaction });
      await queryInterface.removeColumn('Users', 'townId', { transaction });
      await queryInterface.removeColumn('Users', 'admin', { transaction });
      await queryInterface.addColumn('Users', 'entity', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });
      await queryInterface.addColumn('Users', 'place', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
