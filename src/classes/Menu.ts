import Phaser from 'phaser';
import MenuItem from './MenuItem';
import Unit from './Unit';

export default class Menu extends Phaser.GameObjects.Container{
    private menuItems: MenuItem[];
    protected menuItemIndex: number;
    selected!: boolean;

    constructor(
        x: number,
        y: number,
        scene: Phaser.Scene,
    ) {
        super(
            scene,
            x,
            y
        );
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.x = x;
        this.y = y;
        this.selected = false;
    }

    addMenuItem(unit: string | string[]) {
        const menuItem = new MenuItem(0, this.menuItems.length * 35, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem);
        return menuItem;
    }

    // menu navigation
    moveSelectionUp() {
        this.menuItems[this.menuItemIndex].deselect();

        do {
            this.menuItemIndex--;
            if (this.menuItemIndex < 0) {
                this.menuItemIndex = this.menuItems.length - 1;
            }
        } while (!this.menuItems[this.menuItemIndex].active);

        this.menuItems[this.menuItemIndex].select();
    }

    moveSelectionDown() {
        this.menuItems[this.menuItemIndex].deselect();

        do {
            this.menuItemIndex++;
            if (this.menuItemIndex >= this.menuItems.length) {
                this.menuItemIndex = 0;
            }
        } while (!this.menuItems[this.menuItemIndex].active);

        this.menuItems[this.menuItemIndex].select();
    }

    // select the menu as a whole and highlight the chosen element
    select(index: number) {
        if (!index) {
            index = 0;
        }

        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;

        while(!this.menuItems[this.menuItemIndex].active) {
            this.menuItemIndex++;
            if (this.menuItemIndex >= this.menuItems.length) {
                this.menuItemIndex = 0;
            }
            if (this.menuItemIndex == index) {
                return;
            }
        }

        this.menuItems[this.menuItemIndex].select();
        this.selected = true;
    }

    // deselect this menu
    deselect() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
        this.selected = false;
    }

    confirm() {
        // when the player confirms his selection, do the action
    }

    // clear menu and remove all menu items
    clear() {
        for (let i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    }

    remap(units: Unit[]) {
        this.clear();
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            unit.setMenuItem(this.addMenuItem(unit.type));
        }
        this.menuItemIndex = 0;
    }
}