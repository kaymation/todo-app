class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items do |t|
      t.string :body
      t.boolean :done

      t.timestamps
    end
  end
end
