<template>
    <div class="row">
        <div class="col s3" style="padding-left:30px;">
            <p style="font-weight: bold;font-size: 14pt;">FCCMPC - HVCS</p>
            <router-view name="sidebar" />    
        </div>
        
        <router-view class="col s9" name="main"/>
    </div>
</template>