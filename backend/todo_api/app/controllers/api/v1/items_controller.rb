class Api::V1::ItemsController < ApplicationController
    before_action :find_item, only: [:show, :update, :destroy]

    def index
        @items = Item.all_sorted
        render json: @items
    end

    def show
        render json: @item
    end

    def create
        @item = Item.new(item_params)
        if @item.save
            render json: @item
        else
            render error: { error: "Unable to create item"}, status: 400
        end
    end

    def update
        if @item
            @item.update(item_params)
            render json: { message: "Successfully updated item"}, status: 200
        else
            render error: { error: "Unable to update item"}, status: 400
        end
    end

    def destroy
        if @item
            @item.destroy
            render json: { message: "Successfully deleted item"}, status: 200
        else
            render error: { error: "Unable to delete item"}, status: 400
        end
    end


    private

    def item_params
        params.require(:item).permit(:body, :done)
    end

    def find_item
        @item = Item.find(params[:id])
    end
end
