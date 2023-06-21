<template>
<v-container>
    <v-overlay v-model="loading">
        <div class="spinner-holder">
            <div class="spinner-holder-offset">
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="blue"
                    indeterminate
                    ></v-progress-circular>
            </div>
        </div>
    </v-overlay>
    <v-row justify="center" class="mt-4">
        <v-col cols="sm-12 md-6">
            <v-card elevated rounded min-height="1000">
                <v-row justify="center" class="mt-4">
                    <v-col cols="md-8">
                        <v-row justify="space-between" class="px-4">
                            <v-col md="5" sm="6">
                                <h2 class="todo-title">Todo List App</h2>
                            </v-col>
                            <v-col md="2">
                                <div class="new-button-holder">
                                    <v-btn v-if="!newItemOpen"
                                        color="green"
                                        @click="newItemOpen = true">Add Item</v-btn>
                                </div>
                            </v-col>
                        </v-row>

                            <v-card v-if="newItemOpen" class="mt-4 pa-4">
                                <v-textarea v-model="newItemText" placeholder="Enter your task!"></v-textarea>

                                <v-divider></v-divider>
                                <v-card-actions>
                                    <v-btn color="green" outline @click="addItem">Save</v-btn>
                                    <v-btn color="red" outline @click="closeNew">Cancel</v-btn>
                                </v-card-actions>
                            </v-card>
 
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="md-8 sm-10">
                        <v-card v-for="item in items" :key="item.id" class="ma-2" :color="(item.done) ? 'green' : 'primary'">
                            <template v-if="editingId == item.id">
                                    <v-card class="mt-4 pa-4" color="primary">
                                        <v-textarea v-model="editItemBody"></v-textarea>
                                        <v-divider></v-divider>
                                        <v-card-actions>
                                            <v-btn @click="editItem(item)">Save</v-btn>
                                            <v-btn color="red" outline @click="closeEdit">Cancel</v-btn>
                                        </v-card-actions>
                                    </v-card>

                            </template>
                            <template v-else>
                                <v-row class="pa-4">
                                    <v-col cols="md-8" sm="5">
                                        <span>{{ item.body }}</span>
                                    </v-col>
                                    <v-col md="3" sm="2" offset="md-1" offset-sm="0">
                                        <div class="actions-holder">
                                            <div class="action-button">
                                                <v-btn density="compact"
                                                    :color="(item.done) ? 'lime' : 'blue'"
                                                    icon="mdi-check-circle-outline"
                                                    @click="toggleDone(item)"></v-btn>
                                            </div>
                                            <div class="action-button">
                                                <v-btn density="compact"
                                                    color="blue"
                                                    icon="mdi-pencil"
                                                    @click="openEdit(item)"></v-btn>
                                            </div>
                                            <div class="action-button">
                                                <v-btn density="compact"
                                                        color="red"
                                                        icon="mdi-close"
                                                        @click="showDelete(item.id)">
                                                </v-btn>  
                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-card>
                        <v-dialog
                            v-model="deleteDialog"
                            width="550"
                            >
                            <v-card>
                                <v-card-title class="text-h5 grey lighten-2">
                                Are you sure you want to delete this item?
                                </v-card-title>

                                <v-card-text>
                                    This action cannot be undone
                                </v-card-text>

                                <v-divider></v-divider>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary"
                                        text
                                        @click="() => deleteItem(deleteDialogId)"
                                    >
                                        Yes, I want to delete
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>

import { getItems, updateItem, destroyItem, createItem } from '../fetch/items'
import { arrayMove } from '../etc/utils'

export default {
    async mounted() {
        this.items = await getItems()
        this.loading = false
    },

    data() {
        return {
            items: [],
            editingId: null,
            loading: true,
            newItemOpen: false,
            newItemText: "",
            editItemBody: "",
            deleteDialog: false,
            deleteDialogId: null,
        }
    },

    computed: {

    },

    methods: {
        async toggleDone(item) {
            this.loading = true
            const newStatus = !item.done
            const changes = {
                done: newStatus,
            }
            await updateItem(changes, item.id)
            const toToggleIndex = this.findIndexById(item.id)
            var newIndex = 0
            if (newStatus === false) {
                const lastUndoneIndex = this.items.findIndex(_item => _item.done === true )
                if (lastUndoneIndex !== -1 ) {
                    newIndex = lastUndoneIndex
                } 
            } else {
                newIndex = this.items.length - 1
            }
            arrayMove(this.items, toToggleIndex, newIndex)
            this.items[newIndex].done = newStatus
            this.loading = false

        },
        async addItem() {
            this.loading = true
            const newItem = {
                done: false,
                body: this.newItemText,
            }

            const item = await createItem(newItem)
            this.newItemOpen = false
            this.items.splice(0, 0, item)
            this.newItemText = ""
            this.loading = false
        
        },
        async deleteItem(itemId) {
            this.loading = true
            this.deleteDialog = false
            console.log(itemId)
            await destroyItem(itemId)
            const toDeleteIndex = this.findIndexById(itemId)
            this.items.splice(toDeleteIndex, 1)
            this.loading = false
        },
        async editItem(item) {
            this.loading = true
            const changes = {
                done: item.done,
                body: this.editItemBody,
            }
            await updateItem(changes, item.id)

            const savedItem = {
                id: item.id,
                body: this.editItemBody,
                done: item.done

            }
            const itemIndex = this.findIndexById(item.id)
            this.items[itemIndex] = savedItem
            this.editingId = null
            this.loading = false

        },
        showDelete(itemId) {
            this.deleteDialog = true
            this.deleteDialogId = itemId
        },
        findIndexById(id) {
            return this.items.findIndex(item => item.id === id)
        },
        openEdit(item) {
            this.editItemBody = item.body
            this.editingId = item.id
        },
        closeEdit() {
            this.editingId = null
        },
        closeNew() {
            this.newItemOpen = false
        }
    }
}
</script>

<style scoped>
    .actions-holder {
        display: flex;
        justify-content: flex-end;
    }

    .action-button {
        padding: 0 10px;
    }

    .spinner-holder {
        position: absolute;
        width: 1000px;
        height: 2000px;
    }

    .spinner-holder-offset {
        position: relative;
        left: 80%;
        top: 17%;
    }

    @media (max-width: 640px) {
        .actions-holder {
            justify-content: center;
        }

        .new-button-holder {
            display: flex;
            justify-content: right;
        }

        .todo-title {
            font-size: 21px
        }

        .spinner-holder {
            width: 200px;
            height: 1750px;
        }
    }
</style>