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
                                    <v-btn color="green" @click="addItem">Add Item</v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row justify="center">
                    <v-col cols="md-8 sm-10">
                        <v-card v-for="item in items" :key="item.key" class="ma-2" :color="(item.done) ? 'green' : 'primary'">
                            <template v-if="editingId == item.id">
                                <v-row class="pa-4">
                                    <v-textarea :value="item.body"></v-textarea>
                                </v-row>
                                <v-row>
                                    <v-btn @click="saveItem(item)">Save</v-btn>
                                </v-row>
                            </template>
                            <template v-else>
                                <v-row class="pa-4">
                                    <v-col cols="md-8" sm="5">
                                        <span>{{ item.body }} {{ item.id}}</span>
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
                                                <v-dialog
                                                    v-model="deleteDialog"
                                                    width="550"
                                                    >
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn density="compact"
                                                        color="red"
                                                        icon="mdi-close"
                                                        v-bind="props"
                                                        ></v-btn>  
                                                    </template>
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
                                                                @click="deleteItem(item.id)"
                                                            >
                                                                Yes, I want to delete
                                                            </v-btn>
                                                        </v-card-actions>
                                                    </v-card>
                                                </v-dialog>
                                            </div>
                                        </div>
                                    </v-col>
                                </v-row>
                            </template>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script>

import { getItems, updateItem, destroyItem } from '../fetch/items'
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
            deleteDialog: false,
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
            console.log(newIndex)
            arrayMove(this.items, toToggleIndex, newIndex)
            this.items[newIndex].done = newStatus
            this.loading = false

        },
        async addItem(item) {
        
        },
        async deleteItem(itemId) {
            this.loading = true
            this.deleteDialog = false
            await destroyItem(itemId)
            const toDeleteIndex = this.findIndexById(itemId)
            this.items.splice(toDeleteIndex, 1)
            this.loading = false
        },
        findIndexById(id) {
            return this.items.findIndex(item => item.id === id)
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