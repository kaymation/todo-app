class Item < ApplicationRecord
    class << self
        def all_sorted
            self.order(done: :asc, updated_at: :asc)
        end
    end
end
