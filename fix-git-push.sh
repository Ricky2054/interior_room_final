#!/bin/bash

echo "===== Git Push Issue Fixer ====="
echo
echo "The error you're seeing is because your local branch is behind the remote branch."
echo "Here are options to fix this issue:"
echo
echo "1. Pull and merge (Recommended for beginners)"
echo "2. Pull with rebase"
echo "3. Force push (Use with caution!)"
echo "4. Exit without doing anything"
echo

read -p "Enter your choice (1-4): " option

if [ "$option" = "1" ]; then
    echo
    echo "Running: git pull origin main"
    git pull origin main
    if [ $? -ne 0 ]; then
        echo
        echo "There was an error pulling from the remote repository."
        echo "You may need to resolve merge conflicts manually."
        echo
        read -p "Press Enter to continue..."
        exit 1
    fi
    echo
    echo "Running: git push origin main"
    git push origin main
    if [ $? -ne 0 ]; then
        echo
        echo "There was an error pushing to the remote repository."
        echo
        read -p "Press Enter to continue..."
        exit 1
    fi
elif [ "$option" = "2" ]; then
    echo
    echo "Running: git pull --rebase origin main"
    git pull --rebase origin main
    if [ $? -ne 0 ]; then
        echo
        echo "There was an error rebasing with the remote repository."
        echo "You may need to resolve merge conflicts manually."
        echo
        read -p "Press Enter to continue..."
        exit 1
    fi
    echo
    echo "Running: git push origin main"
    git push origin main
    if [ $? -ne 0 ]; then
        echo
        echo "There was an error pushing to the remote repository."
        echo
        read -p "Press Enter to continue..."
        exit 1
    fi
elif [ "$option" = "3" ]; then
    echo
    echo "WARNING: Force pushing will overwrite the remote branch with your local branch."
    echo "This may cause data loss if there are important changes in the remote branch."
    echo
    read -p "Are you sure you want to continue? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo
        echo "Running: git push -f origin main"
        git push -f origin main
        if [ $? -ne 0 ]; then
            echo
            echo "There was an error force pushing to the remote repository."
            echo
            read -p "Press Enter to continue..."
            exit 1
        fi
    else
        echo
        echo "Force push cancelled."
        echo
    fi
elif [ "$option" = "4" ]; then
    echo
    echo "Exiting without making any changes."
    echo
else
    echo
    echo "Invalid option. Please run the script again and select a valid option."
    echo
fi

echo
echo "If you need more help, run: npm run fix-git-push"
echo
read -p "Press Enter to continue..." 